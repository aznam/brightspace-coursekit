<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
    
    <xsl:output method="xml" omit-xml-declaration="yes"/>
    
    <xsl:template match="/">
        <section class="ck-section">
            
            <xsl:if test="string(/*/@title)">
                <h2 class="ck-section__title">
                    <xsl:value-of select="/*/@title"/>
                </h2>
            </xsl:if>
            
            <div class="ck-section__content">
                <ck-children/>
            </div>
            
        </section>
    </xsl:template>
    
</xsl:stylesheet>