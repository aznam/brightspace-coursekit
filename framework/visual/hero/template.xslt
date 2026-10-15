<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
    <xsl:output method="xml" omit-xml-declaration="yes"/>
    
    <xsl:template match="/">
        <section class="ck-hero">
            <div class="ck-hero__inner">
                <!-- Condition : on n'affiche <h1> que s'il y a un titre -->
                <xsl:if test="string(/*/@title)">
                    <h1 class="ck-hero__title">
                        <xsl:value-of select="/*/@title"/>
                    </h1>
                </xsl:if>
                
                <!-- Condition : on n'affiche <p> que s'il y a un sous-titre -->
                <xsl:if test="string(/*/@subtitle)">
                    <p class="ck-hero__subtitle">
                        <xsl:value-of select="/*/@subtitle"/>
                    </p>
                </xsl:if>
            </div>
        </section>
    </xsl:template>
    
</xsl:stylesheet>