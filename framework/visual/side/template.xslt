<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
    
    <xsl:output method="xml" omit-xml-declaration="yes"/>
    
    <xsl:template match="/">
        <aside class="ck-side">
            
            <xsl:if test="string(/*/@title)">
                <h2 class="ck-side__title">
                    <xsl:value-of select="/*/@title"/>
                </h2>
            </xsl:if>
            
            <div class="ck-side__body">
                <ck-children/>
            </div>
            
        </aside>
    </xsl:template>
    
</xsl:stylesheet>